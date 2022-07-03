use geo::{point, Contains, Coordinate, LineString, Point, Polygon};
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[derive(Serialize, Deserialize)]
struct PointJs {
  x: f64,
  y: f64,
}

#[derive(Serialize, Deserialize)]
struct PolygonJs {
  exterior: Vec<PointJs>,
  interiors: Vec<Vec<PointJs>>,
}

#[wasm_bindgen]
pub fn is_point_in_polygon(
  point: &JsValue,
  polygon: &JsValue,
) -> Result<bool, JsValue> {
  let point_js: PointJs;
  match point.into_serde() {
    Ok(value) => point_js = value,
    Err(_err) => return Err(JsValue::from("Erro ao converter point.")),
  }
  let point: Point<f64> = point!(x: point_js.x, y: point_js.y);

  let polygon_js: PolygonJs;
  match polygon.into_serde() {
    Ok(value) => polygon_js = value,
    Err(_err) => return Err(JsValue::from("Erro ao converter polygon.")),
  }
  let exterior: Vec<Coordinate> = polygon_js
    .exterior
    .iter()
    .map(|value| Coordinate {
      x: value.x,
      y: value.y,
    })
    .collect();
  let interiors: Vec<Vec<Coordinate>> = polygon_js
    .interiors
    .iter()
    .map(|value| {
      value
        .iter()
        .map(|value2| Coordinate {
          x: value2.x,
          y: value2.y,
        })
        .collect()
    })
    .collect();
  let exterior = LineString::new(exterior);
  let interiors: Vec<LineString> = interiors
    .iter()
    .map(|value| LineString::new(value.clone()))
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
    let point_js = JsValue::from_serde(&point).unwrap();
    let polygon = PolygonJs {
      exterior: vec![
        PointJs { x: 30.0, y: 20.0 },
        PointJs { x: 45.0, y: 40.0 },
        PointJs { x: 10.0, y: 40.0 },
        PointJs { x: 30.0, y: 20.0 },
      ],
      interiors: vec![],
    };
    let polygon_js = JsValue::from_serde(&polygon).unwrap();
    assert_eq!(is_point_in_polygon(&point_js, &polygon_js), Ok(true));
    let point = PointJs { x: 10.0, y: 10.0 };
    let point_js = JsValue::from_serde(&point).unwrap();
    assert_eq!(is_point_in_polygon(&point_js, &polygon_js), Ok(false));
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
    let polygon_js = JsValue::from_serde(&polygon).unwrap();
    let point = PointJs { x: 5.0, y: 2.5 };
    let point_js = JsValue::from_serde(&point).unwrap();
    assert_eq!(is_point_in_polygon(&point_js, &polygon_js), Ok(false));

    let point = PointJs { x: 3.5, y: 2.0 };
    let point_js = JsValue::from_serde(&point).unwrap();
    assert_eq!(is_point_in_polygon(&point_js, &polygon_js), Ok(true));
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
    let polygon_js = JsValue::from_serde(&polygon).unwrap();
    let point = PointJs { x: 2.5, y: 2.5 };
    let point_js = JsValue::from_serde(&point).unwrap();
    assert_eq!(is_point_in_polygon(&point_js, &polygon_js), Ok(false));

    let point = PointJs { x: 5.5, y: 2.5 };
    let point_js = JsValue::from_serde(&point).unwrap();
    assert_eq!(is_point_in_polygon(&point_js, &polygon_js), Ok(false));

    let point = PointJs { x: 4.0, y: 2.5 };
    let point_js = JsValue::from_serde(&point).unwrap();
    assert_eq!(is_point_in_polygon(&point_js, &polygon_js), Ok(true));

    let point = PointJs { x: 5.0, y: 6.0 };
    let point_js = JsValue::from_serde(&point).unwrap();
    assert_eq!(is_point_in_polygon(&point_js, &polygon_js), Ok(false));
  }
}
