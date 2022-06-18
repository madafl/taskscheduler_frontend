import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

// import required modules
import { EffectCoverflow, Pagination } from "swiper";
import { MDBBtn } from "mdb-react-ui-kit";
import landingpage1 from "../assets/landingPage1.jpg";
import landingpage2 from "../assets/landingPage2.jpg";
import landingpage3 from "../assets/landingPage3.jpg";

const LandingPage = () => {
  return (
    <>
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={true}
        modules={[EffectCoverflow, Pagination]}
        className="mySwiper"
      >
        <SwiperSlide>
          <img src={landingpage1} alt="lp1" className="slider-imgs" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={landingpage2} alt="lp2" className="slider-imgs" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={landingpage3} alt="lp3" className="slider-imgs" />
        </SwiperSlide>
      </Swiper>
      <div className="buttons">
        <MDBBtn className="m-1 mt-3" href="/login">
          Autentificare
        </MDBBtn>
        <MDBBtn className="m-1 mt-3" href="/login">
          Inregistrare
        </MDBBtn>
      </div>
    </>
  );
};

export default LandingPage;
