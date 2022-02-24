  function formatSonText(str) {
      let reg = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/
      const lyricStrings = str.split("\n")
      let arr = []
      for (const item of lyricStrings) {
        let timeResult = reg.exec(item)
        if(!timeResult)continue
        const minute = timeResult[1] * 60 * 1000
        const second = timeResult[2] * 1000
        const millsecondTime = timeResult[3]
        const millsecond = millsecondTime.length === 2 ? millsecondTime * 10: millsecondTime * 1
        const time = minute + second + millsecond
        const text = item.replace(reg, "")
        let target = {
            time,
            text
        }
        arr.push(target)
      }
    return arr
 } 
 export {
     formatSonText
 }