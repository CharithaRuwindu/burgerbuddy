export default function ItemCard({ itemName, itemCategory, itemPrice, itemAvailability }) {
    return (
      <div className="max-h-36 w-60 border-2 border-black m-2">
        <h2>{itemName}</h2>
        <h3>{itemCategory}</h3>
        <h3>{itemPrice}</h3>
        <p>{itemAvailability}</p>
      </div>
    );
  }
  