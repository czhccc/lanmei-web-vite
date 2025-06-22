import { ElMessage } from 'element-plus'

const createPlainMessage = (type) => {
  return (message) => {
    return ElMessage({
      type,
      message,
      plain: true,
    })
  }
}

const PlainMessage = {
  success: createPlainMessage('success'),
  warning: createPlainMessage('warning'),
  info: createPlainMessage('info'),
  error: createPlainMessage('error'),
}

export default PlainMessage
