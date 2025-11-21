import React from "react";
import { ping } from "ldrs";
ping.register();

function loading() {
  return (
    <div className="loading-indecator">
      <l-ping
        size="45"
        speed="2"
        color="var(--primary-clr)"
      ></l-ping>
    </div>
  );
}

export default loading;
