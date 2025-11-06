import React, { useEffect, useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useParams } from "react-router-dom";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import DetalleTarea from "./DetalleTarjeta";

function SortableItem({ item, onClick, activeId }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: String(item.id) });
  const baseStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    userSelect: 'none'
  };
  const hidden = activeId && String(item.id) === String(activeId);
  const style = hidden ? { ...baseStyle, visibility: 'hidden' } : baseStyle;

  // track pointer down to distinguish short click vs drag
  const pointerDownRef = useRef({ x: 0, y: 0, time: 0 });
  const CLICK_TIME_MS = 100; // max duration to consider a click
  const MOVE_TOLERANCE_PX = 4; // max movement to consider a click

  const handlePointerDown = (e) => {
    // use clientX/Y for pointer events
    pointerDownRef.current = { x: e.clientX || 0, y: e.clientY || 0, time: Date.now() };
  };

  const handlePointerUp = (e) => {
    const start = pointerDownRef.current;
    const dx = (e.clientX || 0) - start.x;
    const dy = (e.clientY || 0) - start.y;
    const dist = Math.hypot(dx, dy);
    const dt = Date.now() - start.time;
    const shortClick = dist <= MOVE_TOLERANCE_PX && dt <= CLICK_TIME_MS;
    if (shortClick && !isDragging) {
      onClick(item);
    }
  };

  // Compose listeners so we do not override dnd-kit start handlers
  const composedListeners = {
    ...listeners,
    onPointerDown: (e) => {
      // only handle primary (left) button to avoid right-click/contextmenu starting a drag
      if (e && typeof e.button !== 'undefined' && e.button !== 0) return;
      if (listeners && typeof listeners.onPointerDown === 'function') listeners.onPointerDown(e);
      handlePointerDown(e);
    },
    onPointerUp: (e) => {
      if (e && typeof e.button !== 'undefined' && e.button !== 0) return;
      if (listeners && typeof listeners.onPointerUp === 'function') listeners.onPointerUp(e);
      handlePointerUp(e);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...composedListeners}
      className={`w-[240px] h-[200px] flex-none rounded-lg overflow-hidden shadow-md flex flex-col border border-gray-700 cursor-pointer tarea-card transition-all duration-300 ${
        isDragging ? 'scale-105 bg-opacity-90' : 'hover:scale-105'
      }`}
    >
      <div className="flex-1 panel" />
      <div className="card p-3">
        <h3 className="text-sm font-bold">{item.titulo}</h3>
        <p className="text-xs text-gray-500">{item.descripcion}</p>
      </div>
    </div>
  );
}

const SeccionCarrusel = ({ titulo, tarjetas, onTarjetaClick, containerId, activeId }) => {
  const referenciaScroll = useRef(null);
  const { setNodeRef: setDroppableNodeRef, isOver } = useDroppable({ id: `container-${containerId}` });

  const desplazarIzquierda = () => {
    referenciaScroll.current && referenciaScroll.current.scrollBy({ left: -250, behavior: "smooth" });
  };

  const desplazarDerecha = () => {
    referenciaScroll.current && referenciaScroll.current.scrollBy({ left: 250, behavior: "smooth" });
  };

  return (
    <div className="panel p-6 h-[300px] rounded-lg shadow-md relative fade-in">
      <h2 className="text-lg font-semibold mb-4">{titulo}</h2>

      <button
        onClick={desplazarIzquierda}
        className="absolute left-[-10px] top-[50%] transform -translate-y-1/2 bg-transparent p-2 rounded-full z-10 cursor-pointer hover:text-gray-400 btn-animate transform hover:scale-110 transition-all duration-200"
        type="button"
      >
        <GrFormPrevious size={24} />
      </button>

      <div className="overflow-hidden w-full">
  <SortableContext items={tarjetas.map((t) => String(t.id))} strategy={horizontalListSortingStrategy}>
          <div
            ref={(el) => {
              // combine refs: scrolling and droppable
              referenciaScroll.current = el;
              setDroppableNodeRef(el);
            }}
            className={`flex space-x-4 min-w-[70vw] max-w-[70vw] overflow-x-auto scrollbar-hide ${isOver ? 'ring-2 ring-blue-400' : ''}`}
          >
            {tarjetas.map((t) => (
              <SortableItem key={t.id} item={t} onClick={onTarjetaClick} activeId={activeId} />
            ))}
          </div>
        </SortableContext>
      </div>

      <button
        onClick={desplazarDerecha}
        className="absolute right-[-10px] top-[50%] transform -translate-y-1/2 bg-transparent p-2 rounded-full z-10 cursor-pointer hover:text-gray-400 btn-animate transform hover:scale-110 transition-all duration-200"
        type="button"
      >
        <GrFormNext size={24} />
      </button>
    </div>
  );
};

const Contenedor = () => {
  const { id: claseId } = useParams(); // clase_id desde la URL
  const alumnoId = localStorage.getItem("usuario_id"); // asumimos que está guardado

  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);
  const [pendientes, setPendientes] = useState([]);
  const [proceso, setProceso] = useState([]);
  const [hechas, setHechas] = useState([]);
  const [activeId, setActiveId] = useState(null); // track currently dragging id for DragOverlay

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (!claseId) return;

    fetch(`${API_URL}/api/trabajos/${claseId}/${alumnoId || 'estu001'}`)
      .then((res) => res.json())
      .then((data) => {
        // ensure each item has an id for DnD
        const ensureIds = (arr) => (Array.isArray(arr) ? arr.map((it, idx) => ({ id: it.id ?? it.titulo ?? `item-${idx}`, ...it })) : []);
        setPendientes(ensureIds(data.sin_hacer || []));
        setProceso(ensureIds(data.en_proceso || []));
        setHechas(ensureIds(data.realizado || []));
      })
      .catch((err) => {
        console.error("Error al cargar tareas:", err);
      });
  }, [claseId, alumnoId]);

  // helper to find which container (pendientes/proceso/hechas) contains an item id
  const findContainerForId = (id) => {
    if (pendientes.find((it) => String(it.id) === String(id))) return 'pendientes';
    if (proceso.find((it) => String(it.id) === String(id))) return 'proceso';
    if (hechas.find((it) => String(it.id) === String(id))) return 'hechas';
    return null;
  };

  // Use a PointerSensor with an activation delay so quick clicks don't start a drag
  // and require only the primary (left) mouse button to initiate dragging.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );
  const handleDragStart = (event) => {
    setActiveId(String(event.active.id));
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return; // nothing to drop on
    const activeId = String(active.id);
    const overIdRaw = String(over.id);

    // determine source container
    const sourceContainer = findContainerForId(activeId);

    // determine destination: if over is a container id (container-<name>) treat as empty-area drop
    let destContainer = null;
    let overItemId = null;
    if (overIdRaw.startsWith("container-")) {
      destContainer = overIdRaw.replace("container-", "");
      overItemId = null;
    } else {
      overItemId = overIdRaw;
      destContainer = findContainerForId(overItemId);
    }

    // if same container => reorder
    if (sourceContainer && destContainer && sourceContainer === destContainer) {
      if (sourceContainer === 'pendientes') {
        const oldIndex = pendientes.findIndex((i) => String(i.id) === activeId);
        const newIndex = pendientes.findIndex((i) => String(i.id) === overItemId);
        setPendientes((items) => arrayMove(items, oldIndex, newIndex));
      } else if (sourceContainer === 'proceso') {
        const oldIndex = proceso.findIndex((i) => String(i.id) === activeId);
        const newIndex = proceso.findIndex((i) => String(i.id) === overItemId);
        setProceso((items) => arrayMove(items, oldIndex, newIndex));
      } else if (sourceContainer === 'hechas') {
        const oldIndex = hechas.findIndex((i) => String(i.id) === activeId);
        const newIndex = hechas.findIndex((i) => String(i.id) === overItemId);
        setHechas((items) => arrayMove(items, oldIndex, newIndex));
      }
      return;
    }

    // move between containers (supports dropping onto an item or onto empty container)
    const moveItemBetween = (fromList, toList, fromSetter, toSetter, overIdForTo = null) => {
      const fromIndex = fromList.findIndex((i) => String(i.id) === activeId);
      if (fromIndex === -1) return; // not found
      const item = fromList[fromIndex];
      const newFrom = Array.from(fromList);
      newFrom.splice(fromIndex, 1);
      const newTo = Array.from(toList);
      const toIndexRaw = overIdForTo ? toList.findIndex((i) => String(i.id) === String(overIdForTo)) : -1;
      if (toIndexRaw === -1) newTo.push(item);
      else newTo.splice(toIndexRaw, 0, item);
      fromSetter(newFrom);
      toSetter(newTo);
    };

    if (sourceContainer === 'pendientes' && destContainer === 'proceso') {
      moveItemBetween(pendientes, proceso, setPendientes, setProceso, overItemId);
    } else if (sourceContainer === 'pendientes' && destContainer === 'hechas') {
      moveItemBetween(pendientes, hechas, setPendientes, setHechas, overItemId);
    } else if (sourceContainer === 'proceso' && destContainer === 'pendientes') {
      moveItemBetween(proceso, pendientes, setProceso, setPendientes, overItemId);
    } else if (sourceContainer === 'proceso' && destContainer === 'hechas') {
      moveItemBetween(proceso, hechas, setProceso, setHechas, overItemId);
    } else if (sourceContainer === 'hechas' && destContainer === 'pendientes') {
      moveItemBetween(hechas, pendientes, setHechas, setPendientes, overItemId);
    } else if (sourceContainer === 'hechas' && destContainer === 'proceso') {
      moveItemBetween(hechas, proceso, setHechas, setProceso, overItemId);
    }
  };

  // helper to find an item object by id across lists
  const findItemById = (id) => {
    const all = [...pendientes, ...proceso, ...hechas];
    return all.find((it) => String(it.id) === String(id));
  };

  if (tareaSeleccionada) {
    return (
      <DetalleTarea
        tarea={tareaSeleccionada}
        onClose={() => setTareaSeleccionada(null)}
      />
    );
  }
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="p-6 space-y-6 flex flex-col items-center">
        <SeccionCarrusel
          titulo="Tareas Pendientes"
          tarjetas={pendientes}
          containerId="pendientes"
          activeId={activeId}
          onTarjetaClick={(t) => setTareaSeleccionada(t)}
        />

        <SeccionCarrusel
          titulo="Tareas en Proceso"
          tarjetas={proceso}
          containerId="proceso"
          activeId={activeId}
          onTarjetaClick={(t) => setTareaSeleccionada(t)}
        />

        <SeccionCarrusel
          titulo="Tareas Hechas"
          tarjetas={hechas}
          containerId="hechas"
          activeId={activeId}
          onTarjetaClick={(t) => setTareaSeleccionada(t)}
        />
      </div>

      <DragOverlay>
        {activeId ? (
          (() => {
            const item = findItemById(activeId);
            if (!item) return null;
            // lightweight preview without hooks
            return (
              <div className={`w-[240px] h-[200px] flex-none rounded-lg overflow-hidden shadow-md flex flex-col border border-gray-700`}>
                  <div className="flex-1 panel" />
                  <div className="card p-3">
                    <h3 className="text-sm font-bold">{item.titulo}</h3>
                    <p className="text-xs text-gray-500">{item.descripcion}</p>
                  </div>
                </div>
            );
          })()
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Contenedor;
