import COS from 'cos-js-sdk-v5';

// 初始化 COS 实例（使用临时密钥更安全，此处以永久密钥为例）
const cos = new COS({
  SecretId: 'YOUR_SECRET_ID', // 替换为你的 SecretId
  SecretKey: 'YOUR_SECRET_KEY', // 替换为你的 SecretKey
});

/**
 * 上传文件到 COS
 * @param {File} file - 文件对象
 * @param {string} dir - 存储目录（如 'images/'）
 * @returns {Promise<string>} 图片的完整 URL
 */
export const uploadToCOS = (file, dir = 'images/') => {
  return new Promise((resolve, reject) => {
    const key = `${dir}${Date.now()}_${file.name}`; // 生成唯一文件名
    cos.putObject(
      {
        Bucket: 'your-bucket-name', // 存储桶名称
        Region: 'ap-shanghai', // 存储桶地域（如 ap-shanghai）
        Key: key,
        Body: file,
        StorageClass: 'STANDARD', // 存储类型
        onProgress: (progressData) => {
          console.log(`上传进度: ${progressData.percent * 100}%`);
        },
      },
      (err, data) => {
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