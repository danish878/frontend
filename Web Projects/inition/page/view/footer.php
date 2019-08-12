<footer>
  <div class="container">
    <div class="row">
      <div class="col-md-3">
        <h3><?php echo $database->aboutTitle; ?></h3>
        <p><?php $myText = $database->aboutDescription->_splitInColumns(1);
			foreach ($myText as $text)
			{
				echo $text;
			}
		 ?></p>
      </div>
      <div class="col-md-3">
        <h3><?php echo $database->tweetTitle; ?></h3>
        <p><?php $tDes = $database->tweetDescription->_splitInColumns(1);
			foreach ($tDes as $tweDes)
			{
				echo $tweDes;
			}
		 ?></p>
      </div>
      <div class="col-md-3">
        <h3><?php echo $database->mailingTitle; ?></h3>
        <p><?php echo $database->mailingDescription; ?></p>
        <br />
        <form action="#" method="post" class="form-inline" role="form">
          <div class="form-group">
            <label class="sr-only" for="exampleInputEmail2">your email:</label>
            <input type="email" class="form-control form-control-lg" id="exampleInputEmail2" placeholder="your email:">
          </div>
          <button type="submit" class="btn btn-info btn-md"><?php echo $database->mailingButtonText; ?></button>
        </form>
      </div>
      <div class="col-md-3">
        <h3><?php echo $database->socialTitle; ?></h3>
        <p><?php $database->socialDescription->_render(); ?></p>
        <div class="social__icons"> <a href="#" class="socialicon socialicon-twitter"></a> <a href="#" class="socialicon socialicon-facebook"></a> <a href="#" class="socialicon socialicon-google"></a> <a href="#" class="socialicon socialicon-mail"></a> </div>
      </div>
    </div>
    <hr>
    <p class="text-center">&copy; <?php echo $database->copyRightsText; ?></p>
  </div>
</footer>