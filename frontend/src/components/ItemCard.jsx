export default function ItemCard({ itemName, itemPrice, itemAvailability }) {
    return (
      <div>
        <h2>{itemName}</h2>
        <h3>{itemPrice}</h3>
        <p>{itemAvailability}</p>
      </div>
    );
  }
  