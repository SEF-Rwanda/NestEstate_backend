import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const checkEnv = (currentEnvValue, targetEnv) => {
  let j = 0;
  if (currentEnvValue === undefined) {
    return false;
  }
  for (let i = 0; i < currentEnvValue.length; i++) {
    if (currentEnvValue[i] === targetEnv[i]) {
      j++;
    }
  }
  if (j === 4) return true;
  else return false;
};

export default checkEnv;
