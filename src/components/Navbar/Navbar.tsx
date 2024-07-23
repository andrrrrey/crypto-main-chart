import style from "./index.module.scss";
import logo from "../../assets/Logo.svg";
import { Link } from "react-router-dom";
import Language from "../language/Language";
import burgerMenu from "../../assets/menu-burger 1.svg";
const Navbar = () => {
  const routes = [
    "Prices",
    "Best crypto exhanges",
    "start a crypto blog",
    "all guides",
    "contact",
  ];
  return (
    <>
      <div className={style.container}>
        <img src={logo} className={style.logo} />
        <div className={style.routesContainer}>
          {routes.map((route, i) => (
            <Link to="" className={"navbar-button"} key={i}>
              {route}
            </Link>
          ))}
        </div>
        <img
          src={burgerMenu}
          className={`${style.burgerMenu} displayOnMobileView`}
        />
      </div>
      <Language />
    </>
  );
};

export default Navbar;
