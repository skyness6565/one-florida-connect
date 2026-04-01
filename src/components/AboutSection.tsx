import mobileAppMockup from "@/assets/mobile-app-mockup.png";
import officeBuilding from "@/assets/office-building.jpg";

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="section-padding">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left - Mobile mockup */}
          <div className="flex justify-center">
            <img
              src={mobileAppMockup}
              alt="Onprofitunity mobile app"
              loading="lazy"
              width={512}
              height={1024}
              className="w-64 md:w-72 drop-shadow-2xl"
            />
          </div>

          {/* Right - About text */}
          <div>
            <div className="inline-block bg-primary/10 px-4 py-1 rounded-full mb-4">
              <span className="text-primary text-sm font-semibold tracking-wide">About Us</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
              About Onprofitunity
            </h2>

            <h3 className="font-heading font-bold text-xl text-foreground mb-4">Our Commitment to You</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              At Onprofitunity, we are dedicated to providing secure, reliable, and innovative financial services. With a focus on trust and integrity, we ensure that your assets are protected and your financial goals are achieved.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Our mission is to build lasting relationships with our clients, through unwavering security, exceptional service, and tailored solutions you can depend on.
            </p>

            <img
              src={officeBuilding}
              alt="Onprofitunity headquarters"
              loading="lazy"
              width={800}
              height={600}
              className="w-full h-48 object-cover rounded-xl shadow-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
