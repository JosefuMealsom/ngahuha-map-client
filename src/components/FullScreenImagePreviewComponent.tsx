export function FullScreenImagePreviewComponent(props: {
  src: string;
  onClose: () => any;
}) {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen object-contain z-20">
      <div className="bg-black absolute top-0 left-0 w-full h-full -z-10"></div>
      <img
        src={props.src}
        className="w-full h-full object-contain cursor-pointer"
        onClick={() => props.onClose()}
      />
    </div>
  );
}
