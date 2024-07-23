import style from "./Index.module.scss";
const Info = ({ info }: any) => {
  const { p1, p2, p3 } = info.about;
  return (
    <div className={`${style.container} flexDirectionColumnOnMobileView`}>
      <div className={style.about}>
        <h3>About {info.name}</h3>
        <div className={style.description}>
          <p>{p1}</p>
          <p>{p2}</p>
          <p>{p3}</p>
        </div>
      </div>
      <div className={style.news}>
        <h3>Latest {info.name} News</h3>
        <div className={style.newsCardsContainer}>
          {info.news.map((item: any, i: number) => (
            <div className={style.newsCard} key={i}>
              <h5>{item.title}</h5>
              <p>{item.shortdescription}</p>
              <h6>{item.author}</h6>
              <div className="divider" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Info;
