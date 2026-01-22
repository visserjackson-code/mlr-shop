import { Badge, OverlayTrigger, Tooltip } from "react-bootstrap";

function getLimitedLabel(record) {
  const total = record?.limitedTotal ?? record?.limited?.limitedTotal;
  const retailer = record?.limitedRetailer ?? record?.limited?.limitedRetailer;

  if (Number.isFinite(total) && total > 0) return `1/${total}`;
  if (retailer) return `${retailer} Exclusive`;
   return "Limited release";
}

function getLimitedHover(record) {
  const total = record?.totalQuantity ?? record?.limited?.totalQuantity;
  const retailer = record?.limitedRetailer ?? record?.limited?.limitedRetailer;
  const details = record?.limitedDetails ?? record?.limited?.limitedDetails ?? "";

  if (Number.isFinite(total) && total > 0) return `${record.limitedNumber} OF ${record.limitedTotal}!`;
  if (retailer && String(retailer).trim().length > 0) return `${retailer.toUpperCase()} EXCLUSIVE — LIMITED RUN`;
  if (details) return details.slice(0, 50);
  return "Exclusive release -- limited copies available!"
}

export default function LimitedBadge({ record, className = "" }) {
  if (!record?.isLimited) return null;

  const label = getLimitedLabel(record);
  const hover = getLimitedHover(record);

  return (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip id={`limited-tip-${record.id}`}>{hover}</Tooltip>}
    >
      <Badge
        bg="warning"
        text="dark"
        className={className}
        style={{ cursor: "help", letterSpacing: "0.02em" }}
      >
        {label}
      </Badge>
    </OverlayTrigger>
  );
}
