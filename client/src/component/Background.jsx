const Background = () => {
  return (
    <div className="fixed inset-0 -z-50 pointer-events-none bg-black">
      
      <div className="absolute inset-0 
      bg-[radial-gradient(#ffffff22_1px,#00091d_1px)] 
      bg-[size:20px_20px]"></div>

      <div className="absolute top-[-200px] left-[30%] w-[600px] h-[600px] bg-purple-500/30 blur-[120px]"></div>

      <div className="absolute bottom-[-200px] right-[30%] w-[600px] h-[600px] bg-blue-500/30 blur-[120px]"></div>

    </div>
  );
};

export default Background;