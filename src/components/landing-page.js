import React from "react";
import {
  MDBCarousel,
  MDBCarouselInner,
  MDBCarouselItem,
  MDBCarouselElement,
  MDBCarouselCaption,
  MDBContainer,
  MDBBtn,
} from "mdb-react-ui-kit";
import landingpage1 from "../assets/landingpage.jpg";

const LandingPage = () => {
  return (
    <MDBContainer breakpoint="xxl" className="mt-5 " id="wave">
      <MDBCarousel showControls showIndicators id="carousel" dark fade>
        <MDBCarouselInner>
          <MDBCarouselItem className="active">
            <MDBCarouselElement src={landingpage1} alt="..." />
            <MDBCarouselCaption>
              <h5>First slide label</h5>
              <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
            </MDBCarouselCaption>
          </MDBCarouselItem>
          <MDBCarouselItem>
            <MDBCarouselElement src={landingpage1} alt="..." />
            <MDBCarouselCaption>
              <h5>Second slide label</h5>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </MDBCarouselCaption>
          </MDBCarouselItem>
          <MDBCarouselItem>
            <MDBCarouselElement src={landingpage1} alt="..." />
            <MDBCarouselCaption>
              <MDBBtn className="mt-3">Autentificare</MDBBtn>
              <MDBBtn className="mt-3">Inregistrare</MDBBtn>
              <p>
                Praesent commodo cursus magna, vel scelerisque nisl consectetur.
              </p>
            </MDBCarouselCaption>
          </MDBCarouselItem>
        </MDBCarouselInner>
      </MDBCarousel>
    </MDBContainer>
  );
};

export default LandingPage;
