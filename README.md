# goodminton
Goal:
Goodminton is like badminton, but good. The goal is to implmement a two-player game in which each player must swing their racket in order to hit the cork 
over the net. 

Features:
We implement collision detection and physics-based simulation to model the motion of the cork - when a racket collides with the cork, it is sent flying
in the opposite direction with some reduced kinetic energy due to the collision. As it is flying in the air, it obeys the rules of gravity due to our 
physics implementation. We use ambient lighting for the halo that spawns when a player wins, and use dynamic object insantiation paired with lighting 
effects to simulate a thunderstorm when rain is turned on. We also have implemented bump mapping on the floor.

How to play:
(y) - Turns rain on
(c) - p1 hits, (v) move player 1 to the left, (b) move player 1 to the right
(j) - p2 hits, (k) move player 2 to the left, (l) move player 2 to the right
(control 0) - view the game from player 2's perspective
(Control 2) - reset to spectator view
(t) - reset the cork to the middle and it feeds towards player 2
(p) - pause the game

As the cork flies towards the player, time the swing of the racket so the racket sends the cork in the appropriate direction to let the cork go over the net.
The first player to miss the cork or hit it into the net/ground loses. 