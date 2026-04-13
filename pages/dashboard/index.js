import React from 'react'
import { useEffect } from 'react';

function Dashboard() {
  useEffect(() => {
    fetch("http://localhost:5000")
      .then(res => res.text())
      .then(data => console.log(data));
  }, []);
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard