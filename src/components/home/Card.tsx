interface CardProps {
  title: string;
  description: string;
  borderColor: string;
}

const Card = ({ title, description, borderColor }: CardProps) => {
  return (
    <div
      className={`border-2 border-[${borderColor}] rounded-4xl p-6 bg-white shadow-2xl h-full`}
    >
      <h3 className="md:text-[18px] lg:text-xl font-bold text-[#000000] mb-4">
        {title}
      </h3>
      <p className="md:text-[16px] lg:text-[18px] text-[#000000]">
        {description}
      </p>
    </div>
  );
};

export default Card;
