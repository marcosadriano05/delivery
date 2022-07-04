use geo::Coordinate;
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

pub fn points_to_coordinates(point_vec: &Vec<PointJs>) -> Vec<Coordinate> {
  point_vec
    .iter()
    .map(|value| Coordinate {
      x: value.x,
      y: value.y,
    })
    .collect()
}
