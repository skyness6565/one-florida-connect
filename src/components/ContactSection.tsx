import { MapPin, Phone, Mail, Clock } from "lucide-react";

const contactItems = [
  { icon: MapPin, title: "Our Address", detail: "1425 Brickell Ave, Suite 800\nMiami, FL 33131" },
  { icon: Phone, title: "WhatsApp", detail: "+1 (475) 265-9996", href: "https://wa.me/14752659996" },
  { icon: Mail, title: "Email Us", detail: "gazinggsunn@gmail.com", href: "mailto:gazinggsunn@gmail.com" },
  { icon: Clock, title: "Branch Hours", detail: "Mon - Fri: 8:30 a.m. - 5:00 p.m.\nSaturday: 9:00 a.m. - 1:00 p.m." },
];

const ContactSection = () => {
  return (
    <section className="py-20 bg-muted">
      <div className="section-padding">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-center text-foreground mb-12">
          How Can We Help You Today?
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {contactItems.map(({ icon: Icon, title, detail, href }) => (
            <div key={title} className="bg-background rounded-xl p-6 shadow-sm border border-border text-center hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <p className="font-heading font-bold text-foreground mb-2">{title}</p>
              {href ? (
                <a href={href} className="text-muted-foreground text-sm whitespace-pre-line hover:text-primary transition-colors">{detail}</a>
              ) : (
                <p className="text-muted-foreground text-sm whitespace-pre-line">{detail}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
