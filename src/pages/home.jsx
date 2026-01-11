import Benefits2 from "../component/benefit2";
import CTABannerSection from "../component/cta";
import JobCarousel from "../component/feature";
import Footer from "../component/footer";
import HeroSection from "../component/hero";
import Benefits from "../component/benefit2";
import TaskController from "../component/testimonial";

const Home = () => {
    return (
        <div>
          <HeroSection />
          <JobCarousel />
            <TaskController />
            <Benefits />
            <CTABannerSection />
            <Footer />  
       
        </div>
    );
};

export default Home;