import style from "./index.module.scss";
import britian from "../../assets/united-kingdom.svg";
import vector from "../../assets/arrow.svg";
const Language = () => {
  return (
    <div className={style.container}>
      <img src={britian} />
      <span>English</span>
      <img src={vector} />
    </div>
  );
};

export default Language;
