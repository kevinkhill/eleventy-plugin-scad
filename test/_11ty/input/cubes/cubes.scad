for (x = [-100:1:100]) {
    off_z = sin(x * 2) * x;
    off_y = cos(x * 2) * x;
    size = abs(x / 4) + .2;

    translate([x, off_y, off_z]) {
        cube(size, center = true);
    }
}
