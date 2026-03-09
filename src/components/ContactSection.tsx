import { MapPin, Phone, Headphones, Video } from "lucide-react";
import businessImg from "@/assets/business-banker.jpg";

const contactItems = [
  { icon: MapPin, title: "Routing #", detail: "251480576" },
  { icon: Phone, title: "Branch Hours:", detail: "Mon - Thurs: 8:30 a.m.-5:00 p.m.\nFriday: 8:30 a.m.-6:00 p.m.\nSaturday: 9:00 a.m.-1:00 p.m." },
  { icon: Headphones, title: "support@oneflorida.bank", detail: "Customer Service" },
  { icon: Video, title: "Video Connect", detail: "Chat Virtually" },
];

const ContactSection = () => {
  return (
    <section>
      <div className="teal-gradient py-16">
        <div className="section-padding">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center text-accent-foreground mb-12">
            How Can We Help You Today?
          </h2>
          <div className="grid sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {contactItems.map(({ icon: Icon, title, detail }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-accent-foreground/30 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="font-bold text-accent-foreground">{title}</p>
                  <p className="text-accent-foreground/80 text-sm whitespace-pre-line">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <img src={businessImg} alt="Banking professional at One Florida Bank" className="w-full h-[400px] object-cover" />
    </section>
  );
};

export default ContactSection;
