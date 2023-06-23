exports.generateUniqueId=()=> {
  const length = 11;
  const min = 10000000000; // Smallest 11-digit number
  const max = 99999999999; // Largest 11-digit number

  const id = Math.floor(Math.random() * (max - min + 1) + min).toString();

  return id;
}
