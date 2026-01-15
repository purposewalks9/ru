
import CTABannerSection from "../components/cta";
import JobCarousel from "../components/feature";
import Footer from "../components/footer";
import HeroSection from "../components/hero";
import Benefits from "../components/benefit2";
import TaskController from "../components/testimonial";


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