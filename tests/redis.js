const { addToRedis, getFromRedis } = require("../libs/redis");

async function exampleUsage() {
  await addToRedis("myKey", "myValue");
  const value = await getFromRedis("myKey");
  console.log("Value From Redis:", value);
}

exampleUsage();
