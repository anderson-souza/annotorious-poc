import { useState, useEffect, useRef } from "react";
import OpenSeaDragon, { TileSource } from "openseadragon";
import * as Annotorious from "@recogito/annotorious-openseadragon";
import "@recogito/annotorious-openseadragon/dist/annotorious.min.css";

type Props = {
  image: string;
};

const AnnotoriousEditor = ({ image }: Props) => {
  const [viewer, setViewer] = useState<OpenSeadragon.Viewer | null>(null);
  const [anno, setAnno] = useState(null);

  const viewerId = "openSeaDragon";

  const InitOpenseadragon = () => {
    viewer && viewer.destroy();

    const initViewer = OpenSeaDragon({
      id: viewerId,
      prefixUrl: "openseadragon-images/",
      animationTime: 0.5,
      blendTime: 0.1,
      constrainDuringPan: true,
      maxZoomPixelRatio: 2,
      minZoomLevel: 1,
      visibilityRatio: 1,
      zoomPerScroll: 2,
      debugMode: true,
      showNavigationControl: false,
      tileSources: {
        url: "https://scitechdaily.com/images/New-Hubble-Image-Shows-Part-of-the-Large-Magellanic-Cloud.jpg",
        type: "image",
      },
    });

    setViewer(initViewer);
    const config = {
      crosshair: true,
      locale: "pt",
      widgets: ["TAG"],
      hotkey: {
        key: "Shift",
        inverted: false,
      },
    };
    const annotate = Annotorious(initViewer, config);
    setAnno(annotate);
    InitAnnotations(annotate);
  };

  const [annotations, setAnnotations] = useState([]);

  const handleCreateAnnotation = (annotation) => {
    console.log("created", annotation);
    // localStorage.setItem(image, JSON.stringify(annotation));
  };

  const handleUpdateAnnotation = (newAnnotation, previousAnnotation) => {
    console.log("newAnnotation", newAnnotation);
    console.log("previousAnnotation", previousAnnotation);
  };

  const handleDeleteAnnotation = (annotation) => {
    console.log(annotation);
  };

  const InitAnnotations = (anno) => {
    anno.on("createAnnotation", handleCreateAnnotation);
    anno.on("updateAnnotation", handleUpdateAnnotation);
    anno.on("deleteAnnotation", handleDeleteAnnotation);
  };

  useEffect(() => {
    InitOpenseadragon();
    return () => {
      viewer && viewer.destroy();
      anno && anno.destroy();
    };
  }, []);

  return (
    <div
      id={viewerId}
      style={{
        height: "800px",
        width: "1200px",
      }}
    ></div>
  );
};

export default AnnotoriousEditor;
