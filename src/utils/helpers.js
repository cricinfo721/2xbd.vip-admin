import moment from "moment";

const obj = {
  currencyFormat: (number = "") => {
    // return new Intl.NumberFormat('en-IN', {}).format(number)
    const options = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
    const formatted = Number(number).toLocaleString("en", options);
    return formatted;
  },
  dateFormat: (date, timeZone) => {
    var convertedDate = new Date(date).toLocaleString(undefined, {
      timeZone:  "Asia/Dhaka",//timeZone ? timeZone :
    });
    return convertedDate.toString(); //return  moment(convertedDate).format("DD-MM-YYYY, h:mm:ss A");
  },
  msgDateFormat: (date, timeZone) => {
    var convertedDate = new Date(date).toLocaleDateString(undefined, {
      timeZone: timeZone ? timeZone : "Asia/Dhaka",
    });

    return convertedDate.toString();
  },
  truncateDecimals :(num, digits)  =>{
    var numS = num.toString(),
        decPos = numS.indexOf('.'),
        substrLength = decPos == -1 ? numS.length : 1 + decPos + digits,
        trimmedResult = numS.substr(0, substrLength),
        finalResult = isNaN(trimmedResult) ? 0 : trimmedResult;

    return parseFloat(finalResult);
    
},
getDomain :()  =>{
  let hostname = window.location.hostname;
  hostname = hostname.replace(/^www\./, "");
  hostname = hostname.replace(/^ag\./, "");
  hostname = hostname.replace(/^msa\./, "");
  hostname = hostname.replace(/^bxawscf\./, "");
  hostname = hostname.replace(/^velki\./, "");
  hostname = hostname.replace(/^aff\./, "");
  return hostname;
}
};

export default obj;
