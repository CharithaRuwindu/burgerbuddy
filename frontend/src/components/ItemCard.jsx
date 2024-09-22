export default function ItemCard({ itemName, itemCategory, itemPrice, itemAvailability }) {
    return (
      <div className="max-h-48 w-60 border-slate-150 border-2 rounded-md m-2 shadow-md">
        <h2>{itemName}</h2>
        <h3>{itemCategory}</h3>
        <h3>{itemPrice}</h3>
        <p>{itemAvailability}</p>
        <span className="flex h-16"><button className="bg-sky-700 text-white m-auto">Add to checklist</button></span>
      </div>
    );
  }
  