import {defs, tiny} from './examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;

const GRAVITY = .01;
const ELASTICITY = 0.8;

class Cube extends Shape {
    constructor() {
        super("position", "normal",);
        // Loop 3 times (for each axis), and inside loop twice (for opposing cube sides):
        this.arrays.position = Vector3.cast(
            [-1, -1, -1], [1, -1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, -1], [-1, 1, -1], [1, 1, 1], [-1, 1, 1],
            [-1, -1, -1], [-1, -1, 1], [-1, 1, -1], [-1, 1, 1], [1, -1, 1], [1, -1, -1], [1, 1, 1], [1, 1, -1],
            [-1, -1, 1], [1, -1, 1], [-1, 1, 1], [1, 1, 1], [1, -1, -1], [-1, -1, -1], [1, 1, -1], [-1, 1, -1]);
        this.arrays.normal = Vector3.cast(
            [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0],
            [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0],
            [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, -1], [0, 0, -1], [0, 0, -1], [0, 0, -1]);
        // Arrange the vertices into a square shape in texture space too:
        this.indices.push(0, 1, 2, 1, 3, 2, 4, 5, 6, 5, 7, 6, 8, 9, 10, 9, 11, 10, 12, 13,
            14, 13, 15, 14, 16, 17, 18, 17, 19, 18, 20, 21, 22, 21, 23, 22);

    }
}
export class GoodMinton extends Scene {
    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();

        this.ball_rad = 3;
        this.cork_coord = [-8.0,-2.0,-2.0];
        this.floor_coord = [0.0,-5.0,0.0];
        this.floor_scale = [100,1.0,50.0]
        this.cork_vel = [0.1,0.3,0.0];

        // At the beginning of our program, load one of each of these shape definitions onto the GPU.
        this.shapes = {
            torus: new defs.Torus(15, 15),
            torus2: new defs.Torus(3, 15),
            sphere3: new (defs.Subdivision_Sphere)(3),
            sphere4: new (defs.Subdivision_Sphere)(4),
            flatSphere1: new (defs.Subdivision_Sphere.prototype.make_flat_shaded_version())(1),
            flatSphere2: new (defs.Subdivision_Sphere.prototype.make_flat_shaded_version())(2),
            circle: new defs.Regular_2D_Polygon(1, 15),
            'cube': new Cube(),
            cork: new (defs.Subdivision_Sphere)(4),
            cylinder: new defs.Rounded_Capped_Cylinder(50, 50),
        };

        // *** Materials
        this.materials = {
            test: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#ffffff")}),
            test2: new Material(new Gouraud_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#992828")}),
            sun: new Material(new defs.Phong_Shader(),
                {ambient: 1, color: hex_color("#ffffff")}),
            planet1: new Material(new defs.Phong_Shader(),
                {diffusivity: 1, color: hex_color("#808080")}),
            planet2phong: new Material(new defs.Phong_Shader(),
                {diffusivity: .2, specularity: 1.0, color: hex_color("#80FFFF")}),
            planet2gouraud: new Material(new Gouraud_Shader(),
                {diffusivity: .2, specularity: 1.0, color: hex_color("#80FFFF")}),
            planet3: new Material(new defs.Phong_Shader(),
                {diffusivity: 1, specularity: 1, color: hex_color("#B08040")}),
            planet4: new Material(new defs.Phong_Shader(),
                {specularity: 1, color: hex_color("#6488ea")}),
            planet4moon: new Material(new defs.Phong_Shader(),
                {diffusivity: 0.2, ambience: 0.5, color: hex_color("#ffffff")}),
            //ring: new Material(new defs.Phong_Shader(), {ambience: 1, color: hex_color("#B08040")}),
            ring: new Material(new Ring_Shader()),
            plastic: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#ffffff")}),
            ground: new Material(new defs.Phong_Shader(),
                {ambient: .5, diffusivity: .6, color: hex_color("#44693D")}),
            day_back: new Material(new defs.Phong_Shader(),
                {ambient: 1, diffusivity: .6, color: hex_color("#7BB2DD")}),
        }

        this.initial_camera_location = Mat4.look_at(vec3(0, 10, 20), vec3(0, 0, 0), vec3(0, 1, 0));
    }

    make_control_panel() {
        // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
        this.key_triggered_button("View solar system", ["Control", "0"], () => this.attached = () => Mat4.inverse(this.initial_camera_location).times(Mat4.translation(0,0,-5)));
        this.new_line();
        this.key_triggered_button("Attach to planet 1", ["Control", "1"], () => this.attached = () => this.planet_1);
        this.key_triggered_button("Attach to planet 2", ["Control", "2"], () => this.attached = () => this.planet_2);
        this.new_line();
        this.key_triggered_button("Attach to planet 3", ["Control", "3"], () => this.attached = () => this.planet_3);
        this.key_triggered_button("Attach to planet 4", ["Control", "4"], () => this.attached = () => this.planet_4);
        this.new_line();
        this.key_triggered_button("Attach to moon", ["Control", "m"], () => this.attached = () => this.moon);
    }

    update_state(){
        //update velocity based on gravity
        if (this.cork_coord[1] > this.floor_coord[1] + this.ball_rad)
            this.cork_vel[1] -= GRAVITY;
        //update velocity based on collisions
        if(this.check_collision_ground() && this.cork_vel[1] < 0){
            this.cork_vel[1] *= -ELASTICITY;
        }
        //update coordinates based on velocity
        this.cork_coord[0] += this.cork_vel[0];
        this.cork_coord[1] += this.cork_vel[1];
        this.cork_coord[2] += this.cork_vel[2];
    }

    check_collision_ground(){
        if (this.cork_coord[1] <= this.floor_coord[1] + this.ball_rad){
            return true;
        }
        else{
            return false
        }
    }

    draw_ball(context, program_state){
        let cork_transform = Mat4.identity().times(Mat4.translation(this.cork_coord[0], this.cork_coord[1], this.cork_coord[2]));
        this.shapes.cork.draw(context, program_state, cork_transform, this.materials.plastic);
    }

    draw_floor(context, program_state){
        let floor_transform = Mat4.identity().times(Mat4.translation(this.floor_coord[0], this.floor_coord[1], this.floor_coord[2])).times(Mat4.scale(this.floor_scale[0], this.floor_scale[1], this.floor_scale[2]));
        this.shapes.cube.draw(context, program_state, floor_transform, this.materials.ground);
    }

    draw_bg(context, program_state){
        let bg_transform = Mat4.identity().times(Mat4.translation(0, 5, -10)).times(Mat4.scale(100, 10, 0));
        this.shapes.cube.draw(context, program_state, bg_transform, this.materials.day_back);
    }


    display(context, program_state) {
        // display():  Called once per frame of animation.
        // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(this.initial_camera_location);
        }

        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, .1, 1000);

        const t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;
        const light_position = vec4(0, 5, 5, 1);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000)];

        this.update_state();
        this.draw_floor(context, program_state);
        this.draw_ball(context, program_state);
        this.draw_bg(context, program_state);

        let p1_raquet_handle_color = hex_color("#6488ea");

        let p1_racket_handle_transform = Mat4.identity().times(Mat4.translation(-10,-1.5,0)).times(Mat4.scale(0.25,2,0.25)).times(Mat4.rotation(Math.PI/2, 1,0,0));
        this.shapes.cylinder.draw(context, program_state, p1_racket_handle_transform, this.materials.plastic.override({color: p1_raquet_handle_color}));

        let p1_racket_head_transform = Mat4.identity().times(Mat4.translation(-10,0,0)).times(Mat4.scale(0.5,1,1)).times(Mat4.rotation(Math.PI/2, 0,1,0));
        this.shapes.cylinder.draw(context, program_state, p1_racket_head_transform, this.materials.plastic.override({color: p1_raquet_handle_color}));

        let p2_raquet_handle_color = hex_color("#f1807e");

        let p2_racket_handle_transform = Mat4.identity().times(Mat4.translation(10,-1.5,0)).times(Mat4.scale(0.25,2,0.25)).times(Mat4.rotation(Math.PI/2, 1,0,0));
        this.shapes.cylinder.draw(context, program_state, p2_racket_handle_transform, this.materials.plastic.override({color: p2_raquet_handle_color}));

        let p2_racket_head_transform = Mat4.identity().times(Mat4.translation(10,0,0)).times(Mat4.scale(0.5,1,1)).times(Mat4.rotation(Math.PI/2, 0,1,0));
        this.shapes.cylinder.draw(context, program_state, p2_racket_head_transform, this.materials.plastic.override({color: p2_raquet_handle_color}));

        let net_color = hex_color("ffff00")

        let net_pole1_transform = Mat4.identity().times(Mat4.translation(0,-2,9)).times(Mat4.scale(0.25,5,0.25)).times(Mat4.rotation(Math.PI/2, 1,0,0));
        this.shapes.cylinder.draw(context, program_state, net_pole1_transform, this.materials.plastic.override({color: net_color}));

        let net_pole2_transform = Mat4.identity().times(Mat4.translation(0,-2,-9)).times(Mat4.scale(0.25,5,0.25)).times(Mat4.rotation(Math.PI/2, 1,0,0));
        this.shapes.cylinder.draw(context, program_state, net_pole2_transform, this.materials.plastic.override({color: net_color}));


        if(this.attached !== undefined){
            let desired = Mat4.inverse(this.attached().times(Mat4.translation(0, 0, 5)));
            let blending_factor = 0.1;
            program_state.set_camera(desired.map((x,i) => Vector.from(program_state.camera_inverse[i]).mix(x, blending_factor)));
        }
    }
}

class Gouraud_Shader extends Shader {
    // This is a Shader using Phong_Shader as template

    constructor(num_lights = 2) {
        super();
        this.num_lights = num_lights;
    }

    shared_glsl_code() {
        // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
        return ` 
        precision mediump float;
        const int N_LIGHTS = ` + this.num_lights + `;
        uniform float ambient, diffusivity, specularity, smoothness;
        uniform vec4 light_positions_or_vectors[N_LIGHTS], light_colors[N_LIGHTS];
        uniform float light_attenuation_factors[N_LIGHTS];
        uniform vec4 shape_color;
        uniform vec3 squared_scale, camera_center;
        varying vec4 vertex_color;

        // Specifier "varying" means a variable's final value will be passed from the vertex shader
        // on to the next phase (fragment shader), then interpolated per-fragment, weighted by the
        // pixel fragment's proximity to each of the 3 vertices (barycentric interpolation).
        varying vec3 N, vertex_worldspace;
        // ***** PHONG SHADING HAPPENS HERE: *****                                       
        vec3 phong_model_lights( vec3 N, vec3 vertex_worldspace ){                                        
            // phong_model_lights():  Add up the lights' contributions.
            vec3 E = normalize( camera_center - vertex_worldspace );
            vec3 result = vec3( 0.0 );
            for(int i = 0; i < N_LIGHTS; i++){
                // Lights store homogeneous coords - either a position or vector.  If w is 0, the 
                // light will appear directional (uniform direction from all points), and we 
                // simply obtain a vector towards the light by directly using the stored value.
                // Otherwise if w is 1 it will appear as a point light -- compute the vector to 
                // the point light's location from the current surface point.  In either case, 
                // fade (attenuate) the light as the vector needed to reach it gets longer.  
                vec3 surface_to_light_vector = light_positions_or_vectors[i].xyz - 
                                               light_positions_or_vectors[i].w * vertex_worldspace;                                             
                float distance_to_light = length( surface_to_light_vector );

                vec3 L = normalize( surface_to_light_vector );
                vec3 H = normalize( L + E );
                // Compute the diffuse and specular components from the Phong
                // Reflection Model, using Blinn's "halfway vector" method:
                float diffuse  =      max( dot( N, L ), 0.0 );
                float specular = pow( max( dot( N, H ), 0.0 ), smoothness );
                float attenuation = 1.0 / (1.0 + light_attenuation_factors[i] * distance_to_light * distance_to_light );
                
                vec3 light_contribution = shape_color.xyz * light_colors[i].xyz * diffusivity * diffuse
                                                          + light_colors[i].xyz * specularity * specular;
                result += attenuation * light_contribution;
            }
            return result;
        } `;
    }

    vertex_glsl_code() {
        // ********* VERTEX SHADER *********
        return this.shared_glsl_code() + `
            attribute vec3 position, normal;                            
            // Position is expressed in object coordinates.
            
            uniform mat4 model_transform;
            uniform mat4 projection_camera_model_transform;
    
            void main(){                                                                   
                // The vertex's final resting place (in NDCS):
                gl_Position = projection_camera_model_transform * vec4( position, 1.0 );
                // The final normal vector in screen space.
                N = normalize( mat3( model_transform ) * normal / squared_scale);
                vertex_worldspace = ( model_transform * vec4( position, 1.0 ) ).xyz;
                
                // Compute an initial (ambient) color:
                vertex_color = vec4( shape_color.xyz * ambient, shape_color.w );
                // Compute the final color with contributions from lights:
                vertex_color.xyz += phong_model_lights(N, vertex_worldspace );
            } `;
    }

    fragment_glsl_code() {
        // ********* FRAGMENT SHADER *********
        // A fragment is a pixel that's overlapped by the current triangle.
        // Fragments affect the final image or get discarded due to depth.
        return this.shared_glsl_code() + `
            void main(){                                                           
                gl_FragColor = vertex_color;
            } `;
    }

    send_material(gl, gpu, material) {
        // send_material(): Send the desired shape-wide material qualities to the
        // graphics card, where they will tweak the Phong lighting formula.
        gl.uniform4fv(gpu.shape_color, material.color);
        gl.uniform1f(gpu.ambient, material.ambient);
        gl.uniform1f(gpu.diffusivity, material.diffusivity);
        gl.uniform1f(gpu.specularity, material.specularity);
        gl.uniform1f(gpu.smoothness, material.smoothness);
    }

    send_gpu_state(gl, gpu, gpu_state, model_transform) {
        // send_gpu_state():  Send the state of our whole drawing context to the GPU.
        const O = vec4(0, 0, 0, 1), camera_center = gpu_state.camera_transform.times(O).to3();
        gl.uniform3fv(gpu.camera_center, camera_center);
        // Use the squared scale trick from "Eric's blog" instead of inverse transpose matrix:
        const squared_scale = model_transform.reduce(
            (acc, r) => {
                return acc.plus(vec4(...r).times_pairwise(r))
            }, vec4(0, 0, 0, 0)).to3();
        gl.uniform3fv(gpu.squared_scale, squared_scale);
        // Send the current matrices to the shader.  Go ahead and pre-compute
        // the products we'll need of the of the three special matrices and just
        // cache and send those.  They will be the same throughout this draw
        // call, and thus across each instance of the vertex shader.
        // Transpose them since the GPU expects matrices as column-major arrays.
        const PCM = gpu_state.projection_transform.times(gpu_state.camera_inverse).times(model_transform);
        gl.uniformMatrix4fv(gpu.model_transform, false, Matrix.flatten_2D_to_1D(model_transform.transposed()));
        gl.uniformMatrix4fv(gpu.projection_camera_model_transform, false, Matrix.flatten_2D_to_1D(PCM.transposed()));

        // Omitting lights will show only the material color, scaled by the ambient term:
        if (!gpu_state.lights.length)
            return;

        const light_positions_flattened = [], light_colors_flattened = [];
        for (let i = 0; i < 4 * gpu_state.lights.length; i++) {
            light_positions_flattened.push(gpu_state.lights[Math.floor(i / 4)].position[i % 4]);
            light_colors_flattened.push(gpu_state.lights[Math.floor(i / 4)].color[i % 4]);
        }
        gl.uniform4fv(gpu.light_positions_or_vectors, light_positions_flattened);
        gl.uniform4fv(gpu.light_colors, light_colors_flattened);
        gl.uniform1fv(gpu.light_attenuation_factors, gpu_state.lights.map(l => l.attenuation));
    }

    update_GPU(context, gpu_addresses, gpu_state, model_transform, material) {
        // update_GPU(): Define how to synchronize our JavaScript's variables to the GPU's.  This is where the shader
        // recieves ALL of its inputs.  Every value the GPU wants is divided into two categories:  Values that belong
        // to individual objects being drawn (which we call "Material") and values belonging to the whole scene or
        // program (which we call the "Program_State").  Send both a material and a program state to the shaders
        // within this function, one data field at a time, to fully initialize the shader for a draw.

        // Fill in any missing fields in the Material object with custom defaults for this shader:
        const defaults = {color: color(0, 0, 0, 1), ambient: 0, diffusivity: 1, specularity: 1, smoothness: 40};
        material = Object.assign({}, defaults, material);

        this.send_material(context, gpu_addresses, material);
        this.send_gpu_state(context, gpu_addresses, gpu_state, model_transform);
    }
}

class Ring_Shader extends Shader {
    update_GPU(context, gpu_addresses, graphics_state, model_transform, material) {
        // update_GPU():  Defining how to synchronize our JavaScript's variables to the GPU's:
        const [P, C, M] = [graphics_state.projection_transform, graphics_state.camera_inverse, model_transform],
            PCM = P.times(C).times(M);
        context.uniformMatrix4fv(gpu_addresses.model_transform, false, Matrix.flatten_2D_to_1D(model_transform.transposed()));
        context.uniformMatrix4fv(gpu_addresses.projection_camera_model_transform, false,
            Matrix.flatten_2D_to_1D(PCM.transposed()));
    }

    shared_glsl_code() {
        // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
        return `
        precision mediump float;
        varying vec4 point_position;
        varying vec4 center;
        `;
    }

    vertex_glsl_code() {
        // ********* VERTEX SHADER *********
        return this.shared_glsl_code() + `
        attribute vec3 position;
        uniform mat4 model_transform;
        uniform mat4 projection_camera_model_transform;

        void main(){
            center = model_transform * vec4(0.0, 0.0, 0.0, 1.0);
            point_position = model_transform * vec4(position, 1.0);
            gl_Position = projection_camera_model_transform * vec4(position, 1.0);
        }`;
    }

    fragment_glsl_code() {
        // ********* FRAGMENT SHADER *********
        return this.shared_glsl_code() + `
        void main(){
            float factor = sin(18.0 * distance(point_position, center));
            gl_FragColor = factor * vec4(0.69, 0.5, .25, 1.0);   //#B08040 --> RGB(176, 128, 64) -->(0.69, 0.50, .25)
        }`;
    }
}

