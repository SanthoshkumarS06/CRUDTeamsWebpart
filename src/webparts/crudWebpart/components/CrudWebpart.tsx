import * as React from "react";
import type { ICrudWebpartProps } from "./ICrudWebpartProps";

const CrudWebpart: React.FC<ICrudWebpartProps> = (props) => {
  const { sp } = props;

  React.useEffect(() => {
    if (sp) {
      sp.web.lists
        .getByTitle("Crud Tasks")
        .items()
        .then((items) => {
          console.log("CrudWebpart", items);
        }).catch(console.error);
    }
  }, [sp]);

  return (
    <section>
      <h2>CRUD Webpart</h2>
      <p>{`Welcome, ${props.userDisplayName}`}</p>
      <p>{`Environment: ${props.environmentMessage}`}</p>
      <p>{`Theme: ${props.isDarkTheme ? "Dark" : "Light"}`}</p>
      <p>{`Description: ${props.description}`}</p>
      <p>{`SP: ${sp ? "Available" : "Not Available"}`}</p>
    </section>
  );
};

export default CrudWebpart;
