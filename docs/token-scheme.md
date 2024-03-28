# Token-Scheme

A token consists of 5 parts.

1. The type of module
2. The id of the author
3. The read access
4. The write access
5. A number that is unique to make sure the token itself is unique.

There are 4 types of modules:
- Blockmodule (blm)
- Datamodule
- Backgroundmodule
- Module Bundle

example:

blm-1-R-2-3-W-2-4-810293

blm is the type of module (blockmodule).
1 is the id of the author.
R is the read access and the following numbers are the ids of the users who have read access.
W is the write access and the following numbers are the ids of the users who have write access.
The number is 810293.