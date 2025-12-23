$fn = 64;
size = 20;
cuts = 3.5;

module turning() {
    for (i = [0:6]) {
        translate([0, 0, size/2 - i]) {
            cylinder(d = (size - 2) - i*2, h = cuts, center = true);
        }
    }
}

difference() {
    cube(size, center = true);

    for (r = [
        [  0,   0, 0],   // +Z
        [180,   0, 0],   // -Z
        [ 90,   0, 0],   // +Y
        [-90,   0, 0],   // -Y
        [  0,  90, 0],   // +X
        [  0, -90, 0]    // -X
    ]) {
        rotate(r) {
            turning();
        }
    }
}
