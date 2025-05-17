export default function ItemCard({ itemName, itemCategory, itemPrice, itemImage, itemAvailability }) {
    return (
      <div className="w-60 border-slate-150 border-2 rounded-md mx-auto my-3 shadow-md">
        <div className="w-full h-44"><img src={`data:image/jpeg;base64,${itemImage}`} alt="MenuImage" className="max-h-full m-auto" /></div>
        <h2 className="mt-1 ml-2 font-semibold">{itemName}</h2>
        {/* <h3>{itemCategory}</h3> */}
        <h3 className="ml-2 font-semibold text-yellow-900">{itemPrice}</h3>
        {/* <p>{itemAvailability}</p> */}
        <span className="flex h-16"><button className="bg-sky-700 px-10 py-1 rounded-full text-white m-auto">Add to checklist</button></span>
      </div>
    );
  }
  