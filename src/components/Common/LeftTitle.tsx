// components/Common/LeftTitle.tsx

interface LeftTitleProps {
  title: string;
}

const LeftTitle: React.FC<LeftTitleProps> = ({ title }) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-lg font-bold">{title}</h1>
    </div>
  );
};

export default LeftTitle;
