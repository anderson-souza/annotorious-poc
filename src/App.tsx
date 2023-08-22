import { useState, useEffect, useRef } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

import { Annotorious } from "@recogito/annotorious";

import "@recogito/annotorious/dist/annotorious.min.css";
import imgUrl from "./assets/640px-Hallstatt.jpg";
import AnnotoriousEditor from "./AnnotoriousEditor";

function App() {
  // Ref to the image DOM element
  const imgEl = useRef();

  // The current Annotorious instance
  const [anno, setAnno] = useState();

  // Current drawing tool name
  const [tool, setTool] = useState("rect");

  // Init Annotorious when the component
  // mounts, and keep the current 'anno'
  // instance in the application state
  // useEffect(() => {
  //   let annotorious = null;

  //   if (imgEl.current) {
  //     // Init

  //     annotorious = new Annotorious({
  //       image: imgEl.current,
  //       crosshair: true,
  //       widgets: [
  //         {
  //           widget: "TAG",
  //           vocabulary: [
  //             { label: "Place", uri: "http://www.example.com/ontology/place" },
  //             {
  //               label: "Person",
  //               uri: "http://www.example.com/ontology/person",
  //             },
  //             { label: "Event", uri: "http://www.example.com/ontology/event" },
  //           ],
  //         },
  //       ],
  //     });

  //     // Attach event handlers here
  //     annotorious.on("createAnnotation", (annotation) => {
  //       console.log("created", annotation);
  //     });

  //     annotorious.on("updateAnnotation", (annotation, previous) => {
  //       console.log("updated", annotation, previous);
  //     });

  //     annotorious.on("deleteAnnotation", (annotation) => {
  //       console.log("deleted", annotation);
  //     });
  //   }

  //   // Keep current Annotorious instance in state
  //   setAnno(annotorious);

  //   // Cleanup: destroy current instance
  //   return () => annotorious.destroy();
  // });

  return (
    <div>
      {/* <img ref={imgEl} src={imgUrl} alt="Hallstatt Town Square" /> */}
      <AnnotoriousEditor image={imgUrl} />
    </div>
  );
}

export default App;
