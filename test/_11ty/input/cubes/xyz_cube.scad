cube_size  = 30;   // mm
text_size  = 14;   // font size
engrave    = 1.5;  // mm cut depth
font_name  = "Liberation Sans:style=Bold";

module text_solid(ch) {
  translate([0,0,.1]) {
    linear_extrude(height = engrave) {
      text(ch, size = text_size, font = font_name, halign="center", valign="center");
    }
  }
}

module cut_on_face(face) {
  if (face == "+Z") {
    translate([0,0, cube_size/2 - engrave])
      text_solid(face);
  } else if (face == "-Z") {
    translate([0,0, -cube_size/2 + engrave])
      rotate([180,0,0]) text_solid(face);
  } else if (face == "+Y") {
    translate([0, cube_size/2 - engrave, 0])
      rotate([-90,0,0]) text_solid(face);
  } else if (face == "-Y") {
    translate([0, -cube_size/2 + engrave, 0])
      rotate([90,0,0]) text_solid(face);
  } else if (face == "+X") {
    translate([cube_size/2 - engrave, 0, 0])
      rotate([0,90,0]) text_solid(face);
  } else if (face == "-X") {
    translate([-cube_size/2 + engrave, 0, 0])
      rotate([0,-90,0]) text_solid(face);
  }
}

difference() {
  cube([cube_size, cube_size, cube_size], center=true);

  cut_on_face("+X");
  cut_on_face("-X");

  cut_on_face("+Y");
  cut_on_face("-Y");

  cut_on_face("+Z");
  cut_on_face("-Z");
}
