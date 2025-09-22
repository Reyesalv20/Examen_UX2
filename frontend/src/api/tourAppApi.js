import axiosInstance from "./axiosInstance";

export function ListarTours() {
  return axiosInstance.get("/tours");
}

export function ToursDisponibilidad() {
  return axiosInstance.get("/tours/availability");
}

export function ReservarTour({ person_name, reserved_at, tour_schedule_id }) {
  return axiosInstance.put("/tours/reserve", {
    person_name,
    reserved_at,
    tour_schedule_id,
  });
}
