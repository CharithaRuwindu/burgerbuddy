export default function ItemCard({ itemName, itemCategory, itemPrice, itemAvailability }) {
    return (
      <div className="w-60 bg-slate-500">
        <h2>{itemName}</h2>
        <h3>{itemCategory}</h3>
        <h3>{itemPrice}</h3>
        <p>{itemAvailability}</p>
      </div>
    );
  }
  