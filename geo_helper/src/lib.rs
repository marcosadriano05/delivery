pub mod entities;
use entities::{points_to_coordinates, PointJs, PolygonJs};

use geo::{Contains, LineString, Point, Polygon};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn is_point_in_polygon(
  point: JsValue,
  polygon: JsValue,
) -> Result<bool, JsValue> {
  let point_js: PointJs = match serde_wasm_bindgen::from_value(point) {
    Ok(value) => value,
    Err(_err) => return Err(JsValue::from("Erro ao converter point.")),
  };

  let point: Point<f64> = Point::new(point_js.x, point_js.y);

  let polygon_js: PolygonJs = match serde_wasm_bindgen::from_value(polygon) {
    Ok(value) => value,
    Err(_err) => return Err(JsValue::from("Erro ao converter polygon.")),
  };

  let exterior = LineString::new(points_to_coordinates(&polygon_js.exterior));

  let interiors: Vec<LineString> = polygon_js
    .interiors
    .iter()
    .map(|interior| LineString::new(points_to_coordinates(interior)))
    .collect();

  let polygon: Polygon = Polygon::new(exterior, interiors);
  Ok(polygon.contains(&point))
}

#[cfg(test)]
pub mod tests {
  use super::*;
  use wasm_bindgen_test::*;

  #[wasm_bindgen_test]
  fn point_in_polygon_with_no_intern_polygons() {
    let point = PointJs { x: 25.0, y: 34.0 };
    let point_js = serde_wasm_bindgen::to_value(&point).unwrap();
    let polygon = PolygonJs {
      exterior: vec![
        PointJs { x: 30.0, y: 20.0 },
        PointJs { x: 45.0, y: 40.0 },
        PointJs { x: 10.0, y: 40.0 },
        PointJs { x: 30.0, y: 20.0 },
      ],
      interiors: vec![],
    };
    let polygon_js = serde_wasm_bindgen::to_value(&polygon).unwrap();
    assert_eq!(is_point_in_polygon(point_js, polygon_js.clone()), Ok(true));
    let point = PointJs { x: 10.0, y: 10.0 };
    let point_js = serde_wasm_bindgen::to_value(&point).unwrap();
    assert_eq!(is_point_in_polygon(point_js, polygon_js), Ok(false));
  }

  #[wasm_bindgen_test]
  fn point_in_polygon_with_one_intern_polygon() {
    let polygon = PolygonJs {
      exterior: vec![
        PointJs { x: 3.0, y: 1.0 },
        PointJs { x: 3.0, y: 4.0 },
        PointJs { x: 7.0, y: 4.0 },
        PointJs { x: 7.0, y: 1.0 },
      ],
      interiors: vec![vec![
        PointJs { x: 4.0, y: 3.0 },
        PointJs { x: 4.0, y: 2.0 },
        PointJs { x: 6.0, y: 3.0 },
        PointJs { x: 6.0, y: 2.0 },
      ]],
    };
    let polygon_js = serde_wasm_bindgen::to_value(&polygon).unwrap();
    let point = PointJs { x: 5.0, y: 2.5 };
    let point_js = serde_wasm_bindgen::to_value(&point).unwrap();
    assert_eq!(is_point_in_polygon(point_js, polygon_js.clone()), Ok(false));

    let point = PointJs { x: 3.5, y: 2.0 };
    let point_js = serde_wasm_bindgen::to_value(&point).unwrap();
    assert_eq!(is_point_in_polygon(point_js, polygon_js), Ok(true));
  }

  #[wasm_bindgen_test]
  fn point_in_polygon_with_two_intern_polygons() {
    let polygon = PolygonJs {
      exterior: vec![
        PointJs { x: 1.0, y: 1.0 },
        PointJs { x: 1.0, y: 4.0 },
        PointJs { x: 7.0, y: 4.0 },
        PointJs { x: 7.0, y: 1.0 },
      ],
      interiors: vec![
        vec![
          PointJs { x: 2.0, y: 3.0 },
          PointJs { x: 2.0, y: 2.0 },
          PointJs { x: 3.0, y: 2.0 },
          PointJs { x: 3.0, y: 3.0 },
        ],
        vec![
          PointJs { x: 5.0, y: 3.0 },
          PointJs { x: 5.0, y: 2.0 },
          PointJs { x: 6.0, y: 3.0 },
          PointJs { x: 6.0, y: 2.0 },
        ],
      ],
    };
    let polygon_js = serde_wasm_bindgen::to_value(&polygon).unwrap();
    let point = PointJs { x: 2.5, y: 2.5 };
    let point_js = serde_wasm_bindgen::to_value(&point).unwrap();
    assert_eq!(is_point_in_polygon(point_js, polygon_js.clone()), Ok(false));

    let point = PointJs { x: 5.5, y: 2.5 };
    let point_js = serde_wasm_bindgen::to_value(&point).unwrap();
    assert_eq!(is_point_in_polygon(point_js, polygon_js.clone()), Ok(false));

    let point = PointJs { x: 4.0, y: 2.5 };
    let point_js = serde_wasm_bindgen::to_value(&point).unwrap();
    assert_eq!(is_point_in_polygon(point_js, polygon_js.clone()), Ok(true));

    let point = PointJs { x: 5.0, y: 6.0 };
    let point_js = serde_wasm_bindgen::to_value(&point).unwrap();
    assert_eq!(is_point_in_polygon(point_js, polygon_js), Ok(false));
  }
}
