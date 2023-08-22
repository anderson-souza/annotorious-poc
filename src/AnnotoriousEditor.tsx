import { useState, useEffect, useRef, useCallback } from "react";
import { useDebounceFn } from "ahooks";
import OpenSeaDragon, { TileSource } from "openseadragon";
import * as Annotorious from "@recogito/annotorious-openseadragon";
import "@recogito/annotorious-openseadragon/dist/annotorious.min.css";
import { flushSync } from "react-dom";

type Props = {
  image: string;
};

const AnnotoriousEditor = ({ image }: Props) => {
  const [viewer, setViewer] = useState<OpenSeadragon.Viewer | null>(null);
  const [anno, setAnno] = useState(null);
  const [toggleFunction, setToggleFunction] = useState(true);

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
      disableEditor: true,
      hotkey: {
        key: "Shift",
        inverted: false,
      },
    };
    const annotate = Annotorious(initViewer, config);
    flushSync(() => {
      setAnno(annotate);
    });
    InitAnnotations(annotate);
  };

  useEffect(() => {
    console.log("Anno", anno);
  }, [anno]);

  const [annotations, setAnnotations] = useState([]);

  const handleCreateAnnotation = (annotation) => {
    console.log("created", annotation);
    const newAnnotations = [...annotations, annotation];
    setAnnotations(newAnnotations);
  };

  const handleUpdateAnnotation = (newAnnotation, previousAnnotation) => {
    console.log("newAnnotation", newAnnotation);
    console.log("previousAnnotation", previousAnnotation);
    const newAnnotations = annotations.map((val) => {
      if (val.id === annotation.id) return annotation;
      return val;
    });
    setAnnotations(newAnnotations);
  };

  const handleDeleteAnnotation = (annotation) => {
    console.log(annotation);
    const newAnnotations = annotations.filter(
      (val) => val.id !== annotation.id
    );
    setAnnotations(newAnnotations);
  };

  const { run } = useDebounceFn(
    (target) => {
      console.log("target", target);
      console.log("selected", anno.getSelected());
      const selected = anno.getSelected();
      selected.target = target;
      anno.updateSelected(selected, true);
    },
    {
      wait: 200,
    }
  );

  const InitAnnotations = (anno) => {
    anno.on("createAnnotation", handleCreateAnnotation);
    anno.on("updateAnnotation", handleUpdateAnnotation);
    anno.on("deleteAnnotation", handleDeleteAnnotation);

    anno.on("createSelection", function (selection) {
      // Tag to insert
      console.log("selection", selection);
      selection.body = [
        {
          type: "TextualBody",
          purpose: "tagging",
          value: "MyTag",
        },
      ];
      anno.updateSelected(selection, true);
    });

    anno.on("changeSelectionTarget", run);
  };

  function calculateCombinedBoundingBox() {
    let minX = Number.MAX_SAFE_INTEGER;
    let minY = Number.MAX_SAFE_INTEGER;
    let maxX = Number.MIN_SAFE_INTEGER;
    let maxY = Number.MIN_SAFE_INTEGER;

    console.log(annotations);

    for (const annotation of annotations) {
      console.log("annotation", annotation);

      const [x, y, w, h] = annotation.target.selector.value
        .replace("xywh=pixel:", "")
        .split(",")
        .map(Number);
      console.log(x, y, w, h);
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x + w);
      maxY = Math.max(maxY, y + h);
    }

    const combinedX = minX;
    const combinedY = minY;
    const combinedWidth = maxX - minX;
    const combinedHeight = maxY - minY;

    const combinedValue = `${combinedX},${combinedY},${combinedWidth},${combinedHeight}`;

    const newAnnotation = {
      type: "Selection",
      body: [
        {
          type: "TextualBody",
          purpose: "tagging",
          value: "MyTag",
        },
      ],
      target: {
        source:
          "https://scitechdaily.com/images/New-Hubble-Image-Shows-Part-of-the-Large-Magellanic-Cloud.jpg",
        selector: {
          type: "FragmentSelector",
          conformsTo: "http://www.w3.org/TR/media-frags/",
          value: `xywh=pixel:${combinedValue}`,
        },
      },
    };

    anno.addAnnotation(newAnnotation);

    handleCreateAnnotation(newAnnotation);

    console.log("adding", newAnnotation);

    return combinedValue;
  }

  useEffect(() => {
    console.log("toggleFunction", toggleFunction);
  }, [toggleFunction]);

  useEffect(() => {
    if (!anno) {
      InitOpenseadragon();
    }
    return () => {
      viewer && viewer.destroy();
      anno && anno.destroy();
    };
  }, [image]);

  return (
    <div
      id={viewerId}
      style={{
        height: "800px",
        width: "1200px",
      }}
    >
      <button onClick={() => calculateCombinedBoundingBox()}>
        Teste {toggleFunction.toString()}
      </button>
    </div>
  );
};

export default AnnotoriousEditor;
