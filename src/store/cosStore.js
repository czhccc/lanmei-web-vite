// stores/cosStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

import { _getCOSTemporaryKey } from '../network/upload';

export const useCosStore = defineStore('cos', () => {
  const credentials = ref(null);
  const refreshTimer = ref(null);
  
  // 检查密钥是否即将过期（剩余5分钟）
  const isNearExpiry = () => {
    if (!credentials.value) return true;
    const TEN_MINUTES = 60 * 1000 * 10; // 10分钟
    return Date.now() > (credentials.value.expiredTimestamp * 1000 - TEN_MINUTES);
  };
  
  /**
   * 刷新临时凭证
   */
  const refreshCredentials = async () => {
    try {
      _getCOSTemporaryKey().then(res => {
        credentials.value = res.data

        startAutoRefresh(); // 启动自动刷新定时器
        return true;
      })
      return false;
    } catch (error) {
      console.error('刷新临时凭证失败:', error);
      return false;
    }
  };
  
  /**
   * 确保凭证有效（自动刷新）
   */
  const ensureValidCredentials = async () => {
    // 无凭证或即将过期时刷新
    if (!credentials.value || isNearExpiry()) {
      return await refreshCredentials();
    }
    return true;
  };
  
  /**
   * 启动自动刷新定时器
   */
  const startAutoRefresh = () => {
    if (refreshTimer.value) clearTimeout(refreshTimer.value);
    
    if (!credentials.value) return;
    
    // 在过期前10分钟刷新
    const refreshTime = credentials.value.expiredTimestamp * 1000 - 60 * 1000 * 10 - Date.now();
    
    if (refreshTime > 0) {
      refreshTimer.value = setTimeout(async () => {
        await refreshCredentials();
      }, refreshTime);
    }
  };
  
  /**
   * 初始化凭证
   */
  const initCredentials = async () => {
    await refreshCredentials();
  };
  
  /**
   * 重置凭证
   */
  const resetCredentials = () => {
    if (refreshTimer.value) clearTimeout(refreshTimer.value);
    credentials.value = null;
  };
  
  return {
    credentials,
    initCredentials,
    resetCredentials,
    ensureValidCredentials,
    refreshCredentials
  };
});