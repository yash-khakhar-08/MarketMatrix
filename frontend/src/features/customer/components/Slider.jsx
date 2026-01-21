import bannerImage1 from '../../../banner-1.gif'
import bannerImage2 from '../../../banner-2.jpg'
import bannerImage3 from '../../../banner-3.jpg'

const Slider = () => {

    return (
        <>
            <div className="container-fluid">
              <div id="myCarousel" className="carousel slide" data-ride="carousel">
                <ol className="carousel-indicators">
                  <li
                    data-target="#myCarousel"
                    data-slide-to="0"
                    className="active"
                  ></li>
                  <li data-target="#myCarousel" data-slide-to="1"></li>
                  <li data-target="#myCarousel" data-slide-to="2"></li>
                </ol>
    
                <div className="carousel-inner">
                  <div className="carousel-item active">
                    <img
                      src={bannerImage1}
                      className="d-block w-100"
                      alt="banner 1"
                    />
                  </div>
                  <div className="carousel-item">
                    <img
                      src={bannerImage2}
                      className="d-block w-100"
                      alt="banner 2"
                    />
                  </div>
                  <div className="carousel-item">
                    <img
                      src={bannerImage3}
                      className="d-block w-100"
                      alt="banner 3"
                    />
                  </div>
                </div>
    
                <a
                  className="carousel-control-prev"
                  href="#myCarousel"
                  role="button"
                  data-slide="prev"
                >
                  <span
                    className="carousel-control-prev-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="sr-only">Previous</span>
                </a>
                <a
                  className="carousel-control-next"
                  href="#myCarousel"
                  role="button"
                  data-slide="next"
                >
                  <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="sr-only">Next</span>
                </a>
              </div>
            </div>
          </>
    )
}

export default Slider