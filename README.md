# goodminton

<H2>Goal</H2>
Goodminton is like badminton, but good. The goal is to implmement a two-player game in which each player must swing their racket in order to hit the cork 
over the net.

<H2>Features</H2>
1. <b><i>Collision Detection:</b></i> When a racket collides with the cork, the cork bounces off and is sent flying in the opposite direction. There is also some reduced kinetic energy due to the collision. Also seen when the cork hits the ground.<br> 
2. <b><i>Physics-Based Simulation:</b></i> As the cork is in the air, it obeys the rules of gravity and archs downward.<br> 
3. <b><i>Bump Mapping:</b></i> The court is given texture, and is given a false bumpy feature due to the bump mapping. This helps to give a more realistic look to enhance the environment.<br>  
4. <b><i>Particles / Dynamic Object Instantiation:</b></i> Rain is implemented to fall during the game and can be turned on and off.<br> 
5. <b><i>Lighting:</b></i> Ambient lighting is used for the lightning effects during the rain to help simulate a thunderstorm. It is also used for the halo that spawns when that player wins.<br> 
6. <b><i>Camera:</b></i> The camera starts at a spectator view, and can also be changed to player 2’s perspective (red racket).<br> 
7. <b><i>Texture:</b></i> Texture is added on the ground, walls, cork, racket, and roof.<br> 
8. <b><i>Model/Model Transformations:</b></i> Cork (closed cone and sphere), rackets (cylinders), halo (torus), net (cylinder mesh). The rackets can also be moved left and right on the court.

<H2>How to play</H2>
<b>(y)</b> - Turns rain on<br>
<b>(c)</b> - p1 hits, (v) move player 1 to the left, (b) move player 1 to the right<br>  
<b>(j)</b> - p2 hits, (k) move player 2 to the left, (l) move player 2 to the right<br> 
<b>(control 0)</b> - view the game from player 2's perspective<br> 
<b>(Control 2)</b> - reset to spectator view<br> 
<b>(t)</b> - reset the cork to the middle and it feeds towards player 2<br> 
<b>(p)</b> - pause the game<br> <br>

As the cork flies towards the player, time the swing of the racket so the racket sends the cork in the appropriate direction to let the cork go over the net.
The first player to miss the cork or hit it into the net/ground loses.

<H2>Creators</H2>
Isaac Sterling: isaacjeffrey789@gmail.com <br>
Elliot Lin: elliotlin02@g.ucla.edu <br>
Vikram Chilkunda: vchilkunda@g.ucla.edu <br>
Adarsh Chilkunda: achilkunda@g.ucla.edu <br>
Kristina Domingo: kristinadomingo@g.ucla.edu <br>
