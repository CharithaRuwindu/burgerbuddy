export default function ItemCard({ itemName, itemCategory, itemPrice, itemAvailability }) {
    return (
      <div className="w-60 border-slate-150 border-2 rounded-md m-2 shadow-md">
        <div className="bg-slate-300 w-full h-36"></div>
        <h2 className="mt-1 ml-2">{itemName}</h2>
        {/* <h3>{itemCategory}</h3> */}
        <h3 className="ml-2">{itemPrice}</h3>
        {/* <p>{itemAvailability}</p> */}
        <span className="flex h-16"><button className="bg-sky-700 px-10 py-1 rounded-full text-white m-auto">Add to checklist</button></span>
      </div>
    );
  }
  