use geo::Coord;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct PointJs {
  pub x: f64,
  pub y: f64,
}

#[derive(Serialize, Deserialize)]
pub struct PolygonJs {
  pub exterior: Vec<PointJs>,
  pub interiors: Vec<Vec<PointJs>>,
}

pub fn points_to_coordinates(point_vec: &Vec<PointJs>) -> Vec<Coord> {
  point_vec
    .iter()
    .map(|value| Coord {
      x: value.x,
      y: value.y,
    })
    .collect()
}
