// 如果小数为0或00则省略小数
export default function formatNumber(number) {
	if (isNaN(Number(number))) {
		return '?'
	}

	let num = Number(number)
	// 判断是否为整数
	if (Number.isInteger(num)) {
	  return num; // 如果是整数，直接返回
	} else {
	  // 处理小数部分是否为 .0 或 .00
	  const decimalPart = num.toString().split('.')[1];
	  if (decimalPart === '0' || decimalPart === '00') {
		return Math.floor(num); // 小数部分为 0 或 00 时，返回去掉小数部分的值
	  }
	    return num; // 否则保留小数
	}
}