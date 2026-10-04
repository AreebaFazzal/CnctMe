import MainFooter from "../components/layout/MainFooter";
import Hero from "../components/home/Hero";
import WhyCnctMe from "../components/home/WhyCnctMe";
import FeaturedJobs from "../components/home/FeaturedJobs";
import CallToAction from "../components/home/CallToAction";
import HowItWorks from "../components/home/HowItWorks";
import MainNavbar from "../components/layout/MainNavbar";

const Home = () => {
  return (
    <>
      <MainNavbar />
      <Hero />
      <WhyCnctMe />
      <HowItWorks />
      <FeaturedJobs />
      <CallToAction />
      <MainFooter />
    </>
  );
};

export default Home;
