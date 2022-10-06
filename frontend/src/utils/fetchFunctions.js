async function getNetwork(poly) {
  
  const response = await fetch(`${process.env.REACT_APP_ACCESSIBILITY_API}/network/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      areaId: poly.id,
      geometry: poly,
    }),
  });
  const data = await response.json();
  return data;
}

export { getNetwork };
