
import COS from 'cos-js-sdk-v5';

import dayjs from 'dayjs';

import { useCosStore } from '../store/cosStore';

import PlainMessage from './plainMessage';

// 初始化 COS 实例（使用临时密钥更安全，此处以永久密钥为例）
const cos = new COS({
  SecretId: '...', // 替换为你的 SecretId
  SecretKey: '...', // 替换为你的 SecretKey
});

/**
 * 上传文件到 COS
 * @param {File} file - 文件对象
 * @param {string} dir - 存储目录（如 'images/'）
 * @returns {Promise<string>} 图片的完整 URL
 */
const uploadToCOS = (file, dir = 'images/', identifier = 'no-identifier') => {
  return new Promise((resolve, reject) => {
    // 使用 dayjs 生成时间戳（格式：年月日时分秒）
    const timestamp = dayjs().format('YYYYMMDDHHmmss');

    // 生成3位随机字符（字母+数字）
    const randomChars = Array.from({length: 3}, () => {
      const charset = 'abcdefghijklmnopqrstuvwxyz0123456789';
      return charset.charAt(Math.floor(Math.random() * charset.length));
    }).join('');

    // 获取文件扩展名
    const extension = file.name.split('.').pop().toLowerCase();

    // 构建新文件名
    let fileName = `${timestamp}`;
    if (identifier) fileName += `_${identifier}`;
    fileName += `_${randomChars}.${extension}`;

    // 确保目录路径正确
    const normalizedDir = dir.endsWith('/') ? dir : `${dir}/`;

    cos.putObject(
      {
        Bucket: '...', // 存储桶名称
        Region: 'ap-shanghai', // 存储桶地域（如 ap-shanghai）
        Key: `${normalizedDir}${fileName}`, // 路径+文件名
        Body: file,
        StorageClass: 'STANDARD', // 存储类型
        onProgress: (progressData) => {
          console.log(`上传进度: ${progressData.percent * 100}%`);
        },
      },
      (err, data) => {
        console.log('上传结果:', err, data);
        if (err) {
          reject(err);
        } else {
          // 构建完整的图片 URL
          const url = `https://${data.Location}`;
          resolve(url);
        }
      }
    );
  });
};

export default uploadToCOS
