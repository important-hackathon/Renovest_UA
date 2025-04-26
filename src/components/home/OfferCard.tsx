interface OfferCardProps {
  title: string;
  description: string;
  imageSrc: string;
}

const OfferCard = ({ title, description, imageSrc }: OfferCardProps) => {
  return (
    <div
      className="rounded-4xl py-6 px-5 flex flex-col"
      style={{
        backgroundImage: `url(${imageSrc})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <h3 className="text-2xl font-bold text-[#C6FF80] mb-40">{title}</h3>
      <p className="text-xl text-white mt-auto">{description}</p>
    </div>
  );
};

export default OfferCard;
